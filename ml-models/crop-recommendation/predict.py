import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class CropRecommendation:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'models', 'crop_model.pkl')
        self.model = self.load_model()
        self.crop_types = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Pulses', 'Oilseeds']
        
    def load_model(self):
        """Load the trained model"""
        try:
            if os.path.exists(self.model_path):
                return joblib.load(self.model_path)
            else:
                # If no trained model exists, create a simple one
                return self.create_simple_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            return self.create_simple_model()
    
    def create_simple_model(self):
        """Create a simple rule-based model as fallback"""
        model = RandomForestClassifier(n_estimators=10, random_state=42)
        # Create some dummy training data
        X = np.array([
            [1, 25, 150, 6.5],  # Clay soil, moderate temp, high rainfall, neutral pH
            [2, 30, 100, 7.0],  # Loam soil, high temp, moderate rainfall, neutral pH
            [3, 20, 200, 6.0],  # Sandy soil, low temp, very high rainfall, slightly acidic
        ])
        y = np.array([0, 1, 2])  # Wheat, Rice, Cotton
        model.fit(X, y)
        return model
    
    def preprocess_input(self, soil_type, temperature, rainfall, ph_level):
        """Preprocess input data"""
        # Encode soil type
        soil_encoding = {
            'clay': 1,
            'loam': 2,
            'sandy': 3,
            'black': 4,
            'red': 5
        }
        
        soil_encoded = soil_encoding.get(soil_type.lower(), 2)
        
        # Create feature array
        features = np.array([[soil_encoded, temperature, rainfall, ph_level]])
        
        return features
    
    def recommend_crop(self, soil_type, temperature, rainfall, ph_level):
        """Recommend crop based on input parameters"""
        try:
            # Preprocess input
            features = self.preprocess_input(soil_type, temperature, rainfall, ph_level)
            
            # Make prediction
            prediction = self.model.predict(features)[0]
            
            # Get probability scores
            probabilities = self.model.predict_proba(features)[0]
            
            # Get top 3 recommendations
            top_indices = np.argsort(probabilities)[::-1][:3]
            
            recommendations = []
            for idx in top_indices:
                if idx < len(self.crop_types):
                    recommendations.append({
                        'crop': self.crop_types[idx],
                        'confidence': float(probabilities[idx]),
                        'suitability': self.get_suitability_score(probabilities[idx])
                    })
            
            return {
                'primary_recommendation': recommendations[0],
                'alternatives': recommendations[1:3],
                'input_parameters': {
                    'soil_type': soil_type,
                    'temperature': temperature,
                    'rainfall': rainfall,
                    'ph_level': ph_level
                },
                'recommendations': recommendations
            }
            
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return self.get_fallback_recommendation(soil_type, temperature, rainfall)
    
    def get_suitability_score(self, confidence):
        """Convert confidence to suitability score"""
        if confidence >= 0.8:
            return 'Highly Suitable'
        elif confidence >= 0.6:
            return 'Suitable'
        elif confidence >= 0.4:
            return 'Moderately Suitable'
        else:
            return 'Not Suitable'
    
    def get_fallback_recommendation(self, soil_type, temperature, rainfall):
        """Fallback recommendation based on simple rules"""
        if rainfall > 150:
            return {
                'primary_recommendation': {
                    'crop': 'Rice',
                    'confidence': 0.7,
                    'suitability': 'Suitable'
                },
                'alternatives': [
                    {'crop': 'Sugarcane', 'confidence': 0.6, 'suitability': 'Suitable'},
                    {'crop': 'Maize', 'confidence': 0.5, 'suitability': 'Moderately Suitable'}
                ]
            }
        elif temperature > 25:
            return {
                'primary_recommendation': {
                    'crop': 'Cotton',
                    'confidence': 0.7,
                    'suitability': 'Suitable'
                },
                'alternatives': [
                    {'crop': 'Maize', 'confidence': 0.6, 'suitability': 'Suitable'},
                    {'crop': 'Sugarcane', 'confidence': 0.5, 'suitability': 'Moderately Suitable'}
                ]
            }
        else:
            return {
                'primary_recommendation': {
                    'crop': 'Wheat',
                    'confidence': 0.7,
                    'suitability': 'Suitable'
                },
                'alternatives': [
                    {'crop': 'Pulses', 'confidence': 0.6, 'suitability': 'Suitable'},
                    {'crop': 'Oilseeds', 'confidence': 0.5, 'suitability': 'Moderately Suitable'}
                ]
            }

# API endpoint function
def get_crop_recommendation(data):
    """
    API endpoint for crop recommendation
    Input: {
        'soil_type': string,
        'temperature': number,
        'rainfall': number,
        'ph_level': number
    }
    """
    try:
        recommender = CropRecommendation()
        result = recommender.recommend_crop(
            data['soil_type'],
            data['temperature'],
            data['rainfall'],
            data['ph_level']
        )
        return {
            'success': True,
            'data': result
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    # Test the recommendation system
    test_data = {
        'soil_type': 'clay',
        'temperature': 25,
        'rainfall': 150,
        'ph_level': 6.5
    }
    
    result = get_crop_recommendation(test_data)
    print("Crop Recommendation Result:")
    print(result)
