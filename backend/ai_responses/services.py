"""
Crop and Fertilizer Recommendation Services
Integrates ML recommendation systems with the ai_responses app.
"""

from scripts.crop_recommendation import get_crop_recommendation_system
from scripts.fertilizer_recommendation import get_fertilizer_recommendation_system


def get_crop_suggestion(nitrogen, phosphorus, potassium, temperature, 
                       humidity, ph, rainfall):
    """
    Get crop suggestion based on soil and weather parameters.
    
    Args:
        nitrogen (float): Nitrogen content in the soil
        phosphorus (float): Phosphorus content in the soil
        potassium (float): Potassium content in the soil
        temperature (float): Temperature in Celsius
        humidity (float): Humidity percentage
        ph (float): Soil pH level
        rainfall (float): Rainfall in mm
    
    Returns:
        dict: Dictionary containing recommendation status, crop name, and message
    """
    try:
        system = get_crop_recommendation_system()
        
        crop_name = system.predict_crop(
            nitrogen=float(nitrogen),
            phosphorus=float(phosphorus),
            potassium=float(potassium),
            temperature=float(temperature),
            humidity=float(humidity),
            ph=float(ph),
            rainfall=float(rainfall),
            use_best_model=True
        )
        
        return {
            'status': 'success',
            'crop_name': crop_name,
            'message': f'Based on your soil and weather conditions, we recommend growing {crop_name}.',
            'confidence': 'High'
        }
    
    except Exception as e:
        return {
            'status': 'error',
            'crop_name': None,
            'message': f'Error generating crop recommendation: {str(e)}',
            'confidence': None
        }


def get_fertilizer_suggestion(nitrogen, phosphorous, potassium, soil_type, crop_type,
                             temperature, humidity, moisture):
    """
    Get fertilizer suggestion based on soil and crop parameters.
    
    Args:
        nitrogen (float): Nitrogen content in the soil
        phosphorous (float): Phosphorous content in the soil
        potassium (float): Potassium content in the soil
        soil_type (str): Type of soil
        crop_type (str): Type of crop
        temperature (float): Temperature in Celsius
        humidity (float): Humidity percentage
        moisture (float): Soil moisture percentage
    
    Returns:
        dict: Dictionary containing recommendation status, fertilizer name, and message
    """
    try:
        system = get_fertilizer_recommendation_system()
        
        fertilizer_name = system.predict_fertilizer(
            nitrogen=float(nitrogen),
            phosphorous=float(phosphorous),
            potassium=float(potassium),
            soil_type=str(soil_type),
            crop_type=str(crop_type),
            temperature=float(temperature),
            humidity=float(humidity),
            moisture=float(moisture)
        )
        
        return {
            'status': 'success',
            'fertilizer_name': fertilizer_name,
            'message': f'Based on your soil and crop conditions, we recommend using {fertilizer_name}.',
            'confidence': 'High'
        }
    
    except Exception as e:
        return {
            'status': 'error',
            'fertilizer_name': None,
            'message': f'Error generating fertilizer recommendation: {str(e)}',
            'confidence': None
        }
        


def get_crop_suggestion_from_dict(params):
    """
    Get crop suggestion from a dictionary of parameters.
    
    Args:
        params (dict): Dictionary with keys N, P, K, temperature, humidity, ph, rainfall
    
    Returns:
        dict: Dictionary containing recommendation status, crop name, and message
    """
    return get_crop_suggestion(
        nitrogen=params.get('nitrogen', 0),
        phosphorus=params.get('phosphorus', 0),
        potassium=params.get('potassium', 0),
        temperature=params.get('temperature', 0),
        humidity=params.get('humidity', 0),
        ph=params.get('ph', 0),
        rainfall=params.get('rainfall', 0)
    )
