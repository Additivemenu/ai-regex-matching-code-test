from django.shortcuts import render
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
import pandas as pd
from django.http import JsonResponse

api = NinjaAPI()

@api.get("/", )
def hello(request):
    return 'hello!'


@api.post("/file")
def upload_csv(request, file: UploadedFile = File(...)):
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(file)
    
    # Convert DataFrame to a dictionary for easy JSON serialization
    data = df.to_dict(orient='records')
    
    return JsonResponse({"data": data})

