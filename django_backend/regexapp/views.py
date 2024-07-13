import json
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
    
    # ! Replace NaN values with None
    df = df.where(pd.notnull(df), None)
    
    # Convert DataFrame to a dictionary for easy JSON serialization
    data = df.to_dict(orient='records')

    # TODO: store the table in a mongodb database running in docker -> api url should include file or table id

    return JsonResponse({"data": data})


# request body has user natural language query and table data
@api.post("/table/natural-language-update")
def update_table(request):
    # TODO: verify if user specified column name is really in the table data

    # Get the JSON data from the request
    data = json.loads(request.body)
    print(data)
    return JsonResponse(data)
