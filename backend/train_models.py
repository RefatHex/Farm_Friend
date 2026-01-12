#!/usr/bin/env python
"""
Script to manually train and generate all ML model files.
Run this from the backend directory: python train_models.py
"""

import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))

print("=" * 60)
print("TRAINING ML MODELS FOR FARM FRIEND")
print("=" * 60)

# Train Crop Recommendation Models
print("\n[1/2] CROP RECOMMENDATION MODELS")
print("-" * 60)
try:
    from crop_recommendation import CropRecommendationSystem
    crop_system = CropRecommendationSystem()
    print("✓ Crop models trained and saved successfully!")
except Exception as e:
    print(f"✗ Error training crop models: {e}")
    sys.exit(1)

# Train Fertilizer Recommendation Model
print("\n[2/2] FERTILIZER RECOMMENDATION MODEL")
print("-" * 60)
try:
    from fertilizer_recommendation import FertilizerRecommendationSystem
    fertilizer_system = FertilizerRecommendationSystem()
    print("✓ Fertilizer model trained and saved successfully!")
except Exception as e:
    print(f"✗ Error training fertilizer model: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("ALL MODELS TRAINED SUCCESSFULLY!")
print("Model files saved to: backend/scripts/models/")
print("=" * 60)
