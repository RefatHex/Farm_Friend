import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import RecAIResponse, FertAIResponse, CropSuggestion, FertilizerSuggestion
from .serializers import RecAIResponseSerializer, FertAIResponseSerializer, CropSuggestionSerializer, FertilizerSuggestionSerializer
from .services import get_crop_suggestion, get_fertilizer_suggestion
from scripts.scripts import get_crop_ai_response, get_fertilizer_response
from users.models import UserInfo  


class RecAIResponseView(APIView):
    """
    Handles creating and rating AI responses for recommendations.
    """

    def post(self, request):
        """
        Process AI prompt and save the response.
        Expects JSON like:
        {
          "user": 1,
          "nitrogen": 45.2,
          "phosphorus": 34.1,
          "potassium": 20.5,
          "temperature": 30.1,
          "humidity": 40.2,
          "ph": 6.5,
          "rainfall": 120.3,
          "session_id": 12345
        }
        """
        data = request.data

        # 1. Get the user ID from the request data
        user_id = data.get("user")
        if not user_id:
            return Response(
                {"detail": "A valid 'user' ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Convert that user_id into a UserInfo instance
        user_info = get_object_or_404(UserInfo, pk=user_id)

        # 3. Remove 'user' from the data to avoid assigning an integer to the FK
        cleaned_data = data.copy()
        cleaned_data.pop("user", None)

        # 4. Generate the crop suggestion using ML model
        suggestion_result = get_crop_suggestion(
            nitrogen=cleaned_data.get('nitrogen'),
            phosphorus=cleaned_data.get('phosphorus'),
            potassium=cleaned_data.get('potassium'),
            temperature=cleaned_data.get('temperature'),
            humidity=cleaned_data.get('humidity'),
            ph=cleaned_data.get('ph'),
            rainfall=cleaned_data.get('rainfall')
        )
        
        # Use the recommendation message as the answer
        answer = suggestion_result['message']

        # 5. Create the RecAIResponse object with the user instance
        response_obj = RecAIResponse.objects.create(
            user=user_info,
            answer=answer,
            **cleaned_data
        )

        return Response(
            RecAIResponseSerializer(response_obj).data, 
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, pk):
        """
        Update the answer rating for a specific response.
        Expects JSON like:
        {
          "answer_rating": 4.5
        }
        """
        response_obj = RecAIResponse.objects.filter(id=pk).first()
        if not response_obj:
            return Response({"detail": "Response not found"}, status=status.HTTP_404_NOT_FOUND)

        response_obj.answer_rating = request.data.get("answer_rating")
        response_obj.save()
        return Response({"detail": "Rating updated successfully"}, status=status.HTTP_200_OK)



from rest_framework import status

class FertAIResponseView(APIView):

    """
    Handles creating and rating fertilizer-related AI responses.
    """

    def post(self, request):
        print(request.data)
        """
        Process AI prompt and save the fertilizer response.
        Expects JSON like:
        {
          "user": 1,
          "nitrogen": 45.2,
          "phosphorus": 34.1,
          "potassium": 20.5,
          "temperature": 30.1,
          "humidity": 40.2,
          "moisture": 15.5,
          "crop_type": 1,
          "soil_type": 0,
          "session_id": 12345
        }
        """
        data = request.data

        # 1. Get the user ID from the request data
        user_id = data.get("user")
        if not user_id:
            return Response(
                {"detail": "A valid 'user' ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_info = get_object_or_404(UserInfo, pk=user_id)

        cleaned_data = data.copy()
        cleaned_data.pop("user", None)
        answer = get_fertilizer_response(**cleaned_data, user_id=user_id)

        # 5. Create the FertAIResponse object with the user instance
        response_obj = FertAIResponse.objects.create(
            user=user_info,
            answer=answer,
            **cleaned_data
        )

        return Response(
            FertAIResponseSerializer(response_obj).data,
            status=status.HTTP_201_CREATED
        )

    def patch(self, request, pk):
        """
        Update the answer rating for a specific fertilizer response.
        Expects JSON like:
        {
          "answer_rating": 4
        }
        """
        response_obj = FertAIResponse.objects.filter(id=pk).first()
        if not response_obj:
            return Response({"detail": "Response not found"}, status=status.HTTP_404_NOT_FOUND)

        response_obj.answer_rating = request.data.get("answer_rating")
        response_obj.save()
        return Response({"detail": "Rating updated successfully"}, status=status.HTTP_200_OK)


class CropSuggestionView(APIView):
    """
    Handles crop recommendation requests using ML models.
    Uses the trained crop recommendation system for predictions.
    """

    def post(self, request):
        """
        Get crop recommendation based on environmental parameters.
        Expects JSON like:
        {
          "user": 1,
          "nitrogen": 45.2,
          "phosphorus": 34.1,
          "potassium": 20.5,
          "temperature": 30.1,
          "humidity": 40.2,
          "ph": 6.5,
          "rainfall": 120.3,
          "session_id": 12345
        }
        """
        data = request.data

        # 1. Get the user ID from the request data
        user_id = data.get("user")
        if not user_id:
            return Response(
                {"detail": "A valid 'user' ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate required fields
        required_fields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data or data.get(field) is None:
                return Response(
                    {"detail": f"Field '{field}' is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 2. Convert that user_id into a UserInfo instance
        user_info = get_object_or_404(UserInfo, pk=user_id)

        # 3. Get crop suggestion from ML model
        suggestion_result = get_crop_suggestion(
            nitrogen=float(data.get('nitrogen')),
            phosphorus=float(data.get('phosphorus')),
            potassium=float(data.get('potassium')),
            temperature=float(data.get('temperature')),
            humidity=float(data.get('humidity')),
            ph=float(data.get('ph')),
            rainfall=float(data.get('rainfall'))
        )

        # 4. Create the CropSuggestion object
        crop_suggestion_obj = CropSuggestion.objects.create(
            user=user_info,
            nitrogen=float(data.get('nitrogen')),
            phosphorus=float(data.get('phosphorus')),
            potassium=float(data.get('potassium')),
            temperature=float(data.get('temperature')),
            humidity=float(data.get('humidity')),
            ph=float(data.get('ph')),
            rainfall=float(data.get('rainfall')),
            recommended_crop=suggestion_result['crop_name'],
            recommendation_message=suggestion_result['message'],
            session_id=data.get('session_id')
        )

        return Response(
            CropSuggestionSerializer(crop_suggestion_obj).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request, user_id=None):
        """
        Get crop suggestions for a user or a specific suggestion by ID.
        """
        if user_id:
            # Get a single crop suggestion by ID
            suggestion = CropSuggestion.objects.filter(id=user_id).first()
            if not suggestion:
                return Response(
                    {"detail": "Crop suggestion not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(
                CropSuggestionSerializer(suggestion).data,
                status=status.HTTP_200_OK
            )
        
        # Get all crop suggestions for a user
        user_param = request.query_params.get('user')
        if not user_param:
            return Response(
                {"detail": "User ID is required as query parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        suggestions = CropSuggestion.objects.filter(user_id=user_param).order_by('-created_at')
        serializer = CropSuggestionSerializer(suggestions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, user_id):
        """
        Update the rating for a crop suggestion.
        Expects JSON like:
        {
          "rating": 4.5
        }
        """
        suggestion = CropSuggestion.objects.filter(id=user_id).first()
        if not suggestion:
            return Response(
                {"detail": "Crop suggestion not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        suggestion.rating = request.data.get("rating")
        suggestion.save()
        
        return Response(
            CropSuggestionSerializer(suggestion).data,
            status=status.HTTP_200_OK
        )


class FertilizerSuggestionView(APIView):
    """
    Handles fertilizer recommendation requests using ML models.
    Uses the trained fertilizer recommendation system for predictions.
    """

    def post(self, request):
        """
        Get fertilizer recommendation based on soil and crop parameters.
        Expects JSON like:
        {
          "user": 1,
          "nitrogen": 34,
          "phosphorous": 65,
          "potassium": 62,
          "soil_type": "Loamy",
          "crop_type": "Rice",
          "temperature": 30,
          "humidity": 65,
          "moisture": 70,
          "session_id": 12345
        }
        """
        data = request.data

        # 1. Get the user ID from the request data
        user_id = data.get("user")
        if not user_id:
            return Response(
                {"detail": "A valid 'user' ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate required fields
        required_fields = ['nitrogen', 'phosphorous', 'potassium', 'soil_type', 
                         'crop_type', 'temperature', 'humidity', 'moisture']
        for field in required_fields:
            if field not in data or data.get(field) is None:
                return Response(
                    {"detail": f"Field '{field}' is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 2. Convert that user_id into a UserInfo instance
        user_info = get_object_or_404(UserInfo, pk=user_id)

        # 3. Get fertilizer suggestion from ML model
        suggestion_result = get_fertilizer_suggestion(
            nitrogen=float(data.get('nitrogen')),
            phosphorous=float(data.get('phosphorous')),
            potassium=float(data.get('potassium')),
            soil_type=str(data.get('soil_type')),
            crop_type=str(data.get('crop_type')),
            temperature=float(data.get('temperature')),
            humidity=float(data.get('humidity')),
            moisture=float(data.get('moisture'))
        )

        # 4. Create the FertilizerSuggestion object
        fertilizer_suggestion_obj = FertilizerSuggestion.objects.create(
            user=user_info,
            nitrogen=float(data.get('nitrogen')),
            phosphorous=float(data.get('phosphorous')),
            potassium=float(data.get('potassium')),
            soil_type=str(data.get('soil_type')),
            crop_type=str(data.get('crop_type')),
            temperature=float(data.get('temperature')),
            humidity=float(data.get('humidity')),
            moisture=float(data.get('moisture')),
            recommended_fertilizer=suggestion_result['fertilizer_name'],
            recommendation_message=suggestion_result['message'],
            session_id=data.get('session_id')
        )

        return Response(
            FertilizerSuggestionSerializer(fertilizer_suggestion_obj).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request, user_id=None):
        """
        Get fertilizer suggestions for a user or a specific suggestion by ID.
        """
        if user_id:
            # Get a single fertilizer suggestion by ID
            suggestion = FertilizerSuggestion.objects.filter(id=user_id).first()
            if not suggestion:
                return Response(
                    {"detail": "Fertilizer suggestion not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(
                FertilizerSuggestionSerializer(suggestion).data,
                status=status.HTTP_200_OK
            )
        
        # Get all fertilizer suggestions for a user
        user_param = request.query_params.get('user')
        if not user_param:
            return Response(
                {"detail": "User ID is required as query parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        suggestions = FertilizerSuggestion.objects.filter(user_id=user_param).order_by('-created_at')
        serializer = FertilizerSuggestionSerializer(suggestions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, user_id):
        """
        Update the rating for a fertilizer suggestion.
        Expects JSON like:
        {
          "rating": 4.5
        }
        """
        suggestion = FertilizerSuggestion.objects.filter(id=user_id).first()
        if not suggestion:
            return Response(
                {"detail": "Fertilizer suggestion not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        suggestion.rating = request.data.get("rating")
        suggestion.save()
        
        return Response(
            FertilizerSuggestionSerializer(suggestion).data,
            status=status.HTTP_200_OK
        )
