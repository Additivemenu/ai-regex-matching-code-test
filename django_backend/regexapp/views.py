
from http.client import HTTPException
import json
import re
from django.shortcuts import render
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
import pandas as pd
from django.http import JsonResponse
from ninja.errors import HttpError
from openai import OpenAI

api = NinjaAPI()

from regexapp.services.openai import query_open_ai
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


# request body has user natural language query and table data
@api.post("/table/natural-language-update")
def update_table(request, request_body: TableUpdateRequestBody):
    # Get the JSON data from the request
    table_data = request_body.table_data
    user_query = request_body.user_query

    print(user_query)

    if len(table_data) == 0:
        raise HTTPException(status_code=400, detail="Table data is empty")  # FIXME: add more specific error message

    # LLM_res = queryOpenAI("find the email address column in the table and replace them with 'hello'")
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai(user_query)
    print('------------ end querying OpenAI API ------------')

     # verify if user specified column name is really in the table data
    table_data_headers = table_data[0].keys()
    if LLM_res.column_name not in table_data_headers:
        raise HTTPException(status_code=400, detail="Column name not found in table data, please type in a valid table header name")
    print('table data headers:', table_data_headers)


    # TODO: then do the table updates based on the regex expression and replacement value
    print('--------start processing table data ----------')

    df = pd.DataFrame(table_data)

    # ! value replacing query
    df[LLM_res.column_name] = df[LLM_res.column_name].apply(lambda x: re.sub(LLM_res.regex_pattern, LLM_res.replacement, x) if pd.notnull(x) else x)  
    updated_table_data = df.to_dict(orient='records')



    # ! data transformation query
    # TODO: may be consider regex transforming number field in the future, just consider string for now!
    # df[LLM_res['column_name']] = df[LLM_res['column_name']].apply(lambda x: re.sub(LLM_res['to_regex'], 'Intl', x)) # Apply the regex to the specified column
    # result_json = df.to_json(orient='records', lines=False)


    return JsonResponse({
        "user_query": user_query, 
        "LLM_res": LLM_res.to_dict(),
        "updated_table_data": updated_table_data
        })
    

    
