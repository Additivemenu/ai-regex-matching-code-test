
from django.shortcuts import render
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
import pandas as pd
from django.http import JsonResponse
from ninja.errors import HttpError
from openai import OpenAI
from enum import Enum

api = NinjaAPI()

from regexapp.services.openai import query_open_ai
from regexapp.services.regex_replacement import handle_regex_replacement
from regexapp.ninja_schema.schema import TableUpdateRequestBody

from django.conf import settings


@api.get("/", )
def hello(request):
    # return 'hello world'
    print(settings.OPENAI_API_KEY)
    return JsonResponse({"message": settings.OPENAI_API_KEY})
    


@api.post("/file")
def upload_csv(request, file: UploadedFile = File(...)):
    # TODO: additionally -> need to  consider uploading large files

    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(file)
    
    # ! Replace NaN values with None
    df = df.where(pd.notnull(df), None)
    
    # Convert DataFrame to a dictionary for easy JSON serialization
    data = df.to_dict(orient='records')

    # TODO: store the table in a mongodb database running in docker -> api url should include file or table id

    return JsonResponse({"data": data})


class QueryType(str, Enum):
    REPLACE = "replace"
    TRANSFORM = "transform"
    
# request body has user natural language query and table data
@api.post("/table/natural-language-update")
def update_table(request, request_body: TableUpdateRequestBody):
    # Get the JSON data from the request
    table_data = request_body.table_data
    user_query = request_body.user_query
    query_type = user_query.split(":")[0].lower()
    if query_type is None:
        raise HttpError(400, "Please specify query type in the query string, <query_string>: <query_content>")
    if query_type not in [QueryType.REPLACE, QueryType.TRANSFORM]:
        raise HttpError(400, "Invalid query type, please specify either 'replace:' or 'transform:' at the start of your query")
    if table_data is None or len(table_data) == 0:
        raise HttpError(400, "Table data is empty!")

    df = None
    LLM_res = None
    if query_type == QueryType.REPLACE:
        print('handle replace query')
        df, LLM_res = handle_regex_replacement(table_data, user_query)
    elif query_type == QueryType.TRANSFORM:
        print('handle transform query')


    updated_table_data = df.to_dict(orient='records')
    return JsonResponse({
        "user_query": user_query, 
        "LLM_res": LLM_res.to_dict(),
        "updated_table_data": updated_table_data
    })
    

    
