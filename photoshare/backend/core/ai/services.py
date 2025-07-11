from transformers import pipeline  
from PIL import Image  
import torch  

def analyze_photo(image_path):  
    """Generate AI description and tags for photo"""  
    try:  
        # Image captioning  
        captioner = pipeline(  
            "image-to-text",  
            model="Salesforce/blip-image-captioning-base"  
        )  
        description = captioner(image_path)[0]['generated_text']  

        # Object detection  
        detector = pipeline(  
            "object-detection",  
            model="facebook/detr-resnet-50"  
        )  
        objects = detector(image_path)  
        tags = [obj['label'] for obj in objects]  

        return description, tags[:5]  # Return top 5 tags  

    except Exception as e:  
        print(f"AI Error: {e}")  
        return "AI-generated description", []  