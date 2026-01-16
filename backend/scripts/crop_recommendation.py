

import os
import pandas as pd
import numpy as np
import pickle
import warnings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb

warnings.filterwarnings('ignore')

# Get the base directory for model storage
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATASET_PATH = os.path.join(BASE_DIR, '..', '..', 'dataset', 'Crop_recommendation.csv')

# Create models directory if it doesn't exist
os.makedirs(MODELS_DIR, exist_ok=True)


class CropRecommendationSystem:
    """
    A crop recommendation system that uses multiple ML algorithms to predict
    the best crop based on environmental parameters.
    """
    
    def __init__(self):
        """Initialize the crop recommendation system and load/train models."""
        self.models = {}
        self.best_model = None
        self.best_model_name = None
        self.feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        self._load_or_train_models()
    
    def _load_or_train_models(self):
        """Load pre-trained models or train new ones if they don't exist."""
        model_files = {
            'Decision Tree': 'Decision Tree.pkl',
            'Naive Bayes': 'Naive Bayes.pkl',
            'Support Vector Machine': 'Support Vector Machine.pkl',
            'Logistic Regression': 'Logistic Regression.pkl',
            'Random Forest': 'Random Forest.pkl',
            'XGBoost': 'XGBoost.pkl'
        }
        
        print(f"Models directory: {MODELS_DIR}")
        
        models_exist = all(
            os.path.exists(os.path.join(MODELS_DIR, fname)) 
            for fname in model_files.values()
        )
        
        if models_exist:
            # Load existing models
            print("Loading pre-trained crop models...")
            for model_name, filename in model_files.items():
                filepath = os.path.join(MODELS_DIR, filename)
                with open(filepath, 'rb') as f:
                    loaded_model = pickle.load(f)
                    # Handle XGBoost with label encoder
                    if isinstance(loaded_model, tuple):
                        self.models[model_name] = loaded_model
                    else:
                        self.models[model_name] = loaded_model
            print("✓ Crop models loaded successfully!")
            # Set best model to Random Forest by default after loading
            self.best_model_name = 'Random Forest'
            self.best_model = self.models.get('Random Forest')
            if self.best_model is None:
                # Fallback to first available model if Random Forest not found
                self.best_model_name = list(self.models.keys())[0]
                self.best_model = self.models[self.best_model_name]
        else:
            # Train new models
            print("Training models... This may take a few minutes.")
            self._train_models()
    
    def _train_models(self):
        """Train all classification models and save them."""
        # Load dataset
        if not os.path.exists(DATASET_PATH):
            raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
        
        df = pd.read_csv(DATASET_PATH)
        
        # Prepare features and target
        features = df[self.feature_names]
        target = df['label']
        
        # Encode target for XGBoost (it needs numeric labels)
        label_encoder = LabelEncoder()
        target_encoded = label_encoder.fit_transform(target)
        
        # Split data
        Xtrain, Xtest, Ytrain, Ytest = train_test_split(
            features, target, test_size=0.2, random_state=2
        )
        
        # Also split encoded target for XGBoost
        Xtrain_xgb, Xtest_xgb, Ytrain_xgb, Ytest_xgb = train_test_split(
            features, target_encoded, test_size=0.2, random_state=2
        )
        
        # Dictionary to store accuracies
        accuracies = {}
        
        # 1. Decision Tree
        print("Training Decision Tree...")
        dt = DecisionTreeClassifier(criterion="entropy", random_state=2, max_depth=5)
        dt.fit(Xtrain, Ytrain)
        dt_pred = dt.predict(Xtest)
        dt_acc = accuracy_score(Ytest, dt_pred)
        accuracies['Decision Tree'] = dt_acc
        self.models['Decision Tree'] = dt
        print(f"  Accuracy: {dt_acc:.4f}")
        
        # 2. Naive Bayes
        print("Training Naive Bayes...")
        nb = GaussianNB()
        nb.fit(Xtrain, Ytrain)
        nb_pred = nb.predict(Xtest)
        nb_acc = accuracy_score(Ytest, nb_pred)
        accuracies['Naive Bayes'] = nb_acc
        self.models['Naive Bayes'] = nb
        print(f"  Accuracy: {nb_acc:.4f}")
        
        # 3. Support Vector Machine
        print("Training Support Vector Machine...")
        svm = SVC(gamma='auto')
        svm.fit(Xtrain, Ytrain)
        svm_pred = svm.predict(Xtest)
        svm_acc = accuracy_score(Ytest, svm_pred)
        accuracies['Support Vector Machine'] = svm_acc
        self.models['Support Vector Machine'] = svm
        print(f"  Accuracy: {svm_acc:.4f}")
        
        # 4. Logistic Regression
        print("Training Logistic Regression...")
        lr = LogisticRegression(random_state=2, max_iter=1000)
        lr.fit(Xtrain, Ytrain)
        lr_pred = lr.predict(Xtest)
        lr_acc = accuracy_score(Ytest, lr_pred)
        accuracies['Logistic Regression'] = lr_acc
        self.models['Logistic Regression'] = lr
        print(f"  Accuracy: {lr_acc:.4f}")
        
        # 5. Random Forest
        print("Training Random Forest...")
        rf = RandomForestClassifier(n_estimators=20, random_state=0)
        rf.fit(Xtrain, Ytrain)
        rf_pred = rf.predict(Xtest)
        rf_acc = accuracy_score(Ytest, rf_pred)
        accuracies['Random Forest'] = rf_acc
        self.models['Random Forest'] = rf
        print(f"  Accuracy: {rf_acc:.4f}")
        
        # 6. XGBoost (use encoded labels)
        print("Training XGBoost...")
        xgb_model = xgb.XGBClassifier(random_state=2, verbosity=0)
        xgb_model.fit(Xtrain_xgb, Ytrain_xgb)
        xgb_pred = xgb_model.predict(Xtest_xgb)
        xgb_acc = accuracy_score(Ytest_xgb, xgb_pred)
        accuracies['XGBoost'] = xgb_acc
        self.models['XGBoost'] = (xgb_model, label_encoder)
        print(f"  Accuracy: {xgb_acc:.4f}")
        
        # Find best model
        self.best_model_name = max(accuracies, key=accuracies.get)
        self.best_model = self.models[self.best_model_name]
        print(f"\nBest Model: {self.best_model_name} with accuracy {accuracies[self.best_model_name]:.4f}")
        
        # Save all models
        print("\nSaving models...")
        for model_name, model in self.models.items():
            filepath = os.path.join(MODELS_DIR, f'{model_name}.pkl')
            with open(filepath, 'wb') as f:
                pickle.dump(model, f)
        print("Models saved successfully!")
    
    def predict_crop(self, nitrogen, phosphorus, potassium, temperature, 
                     humidity, ph, rainfall, use_best_model=True):
        """
        Predict the best crop based on environmental parameters.
        
        Args:
            nitrogen (float): Nitrogen content in the soil
            phosphorus (float): Phosphorus content in the soil
            potassium (float): Potassium content in the soil
            temperature (float): Temperature in Celsius
            humidity (float): Humidity percentage
            ph (float): Soil pH level
            rainfall (float): Rainfall in mm
            use_best_model (bool): Use the best model or Random Forest
        
        Returns:
            str: Recommended crop name
        """
        # Prepare input data
        data = np.array([[nitrogen, phosphorus, potassium, temperature, 
                         humidity, ph, rainfall]])
        
        # Use best model or Random Forest by default
        model = self.best_model if use_best_model else self.models.get('Random Forest')
        
        if model is None:
            raise ValueError("Model not found!")
        
        # Handle XGBoost with label encoder
        if isinstance(model, tuple):
            xgb_model, label_encoder = model
            prediction_encoded = xgb_model.predict(data)[0]
            prediction = label_encoder.inverse_transform([prediction_encoded])[0]
        else:
            # Make prediction for other models
            prediction = model.predict(data)[0]
        
        return prediction
    
    def predict_crop_dict(self, params_dict, use_best_model=True):
        """
        Predict crop using a dictionary of parameters.
        
        Args:
            params_dict (dict): Dictionary with keys: N, P, K, temperature, humidity, ph, rainfall
            use_best_model (bool): Use the best model or Random Forest
        
        Returns:
            str: Recommended crop name
        """
        return self.predict_crop(
            nitrogen=params_dict.get('N', 0),
            phosphorus=params_dict.get('P', 0),
            potassium=params_dict.get('K', 0),
            temperature=params_dict.get('temperature', 0),
            humidity=params_dict.get('humidity', 0),
            ph=params_dict.get('ph', 0),
            rainfall=params_dict.get('rainfall', 0),
            use_best_model=use_best_model
        )


# Initialize the system globally (lazy loading)
_crop_system = None


def get_crop_recommendation_system():
    """Get or initialize the crop recommendation system."""
    global _crop_system
    if _crop_system is None:
        _crop_system = CropRecommendationSystem()
    return _crop_system


def recommend_crop(nitrogen, phosphorus, potassium, temperature, 
                   humidity, ph, rainfall, use_best_model=True):
    """
    Main function to get crop recommendation.
    
    Args:
        nitrogen (float): Nitrogen content
        phosphorus (float): Phosphorus content
        potassium (float): Potassium content
        temperature (float): Temperature in Celsius
        humidity (float): Humidity percentage
        ph (float): Soil pH
        rainfall (float): Rainfall in mm
        use_best_model (bool): Use best model (default) or Random Forest
    
    Returns:
        str: Recommended crop name
    """
    system = get_crop_recommendation_system()
    return system.predict_crop(
        nitrogen, phosphorus, potassium, temperature, 
        humidity, ph, rainfall, use_best_model
    )


def recommend_crop_dict(params):
    """
    Get crop recommendation from a dictionary of parameters.
    
    Args:
        params (dict): Dictionary with N, P, K, temperature, humidity, ph, rainfall
    
    Returns:
        str: Recommended crop name
    """
    system = get_crop_recommendation_system()
    return system.predict_crop_dict(params)


if __name__ == '__main__':
    # Test the system
    print("Testing Crop Recommendation System\n")
    
    system = get_crop_recommendation_system()
    
    # Test case 1
    print("Test Case 1:")
    crop1 = system.predict_crop(104, 18, 30, 23.603016, 60.3, 6.7, 140.91)
    print(f"Recommended crop: {crop1}\n")
    
    # Test case 2
    print("Test Case 2:")
    crop2 = system.predict_crop(83, 45, 60, 28, 70.3, 7.0, 150.9)
    print(f"Recommended crop: {crop2}\n")
    
    # Test with dictionary
    print("Test Case 3 (using dictionary):")
    params = {
        'N': 90,
        'P': 42,
        'K': 43,
        'temperature': 20.87,
        'humidity': 82.0,
        'ph': 6.0,
        'rainfall': 202.9
    }
    crop3 = system.predict_crop_dict(params)
    print(f"Recommended crop: {crop3}")
