
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
import pandas as pd
from django.http import JsonResponse
from ninja.errors import HttpError
from enum import Enum

api = NinjaAPI()

from regexapp.services.regex_replacement import handle_regex_replacement
from regexapp.services.data_transformation import handle_data_transformation
from regexapp.ninja_schema.schema import TableUpdateRequestBody

@api.get("/", )
def hello(request):
    return JsonResponse({"message": "Hello World"})
    
allowed_content_types = [
    'text/csv', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

@api.post("/file")
def upload_csv(request, file: UploadedFile = File(...)):
    
    if file.content_type not in allowed_content_types:
        raise HttpError(400, "Invalid file type. Only CSV or Excel files are allowed.")

    # Read the CSV file into a pandas DataFrame
    df = None
    try: 
        if file.content_type == 'text/csv':
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        # formatting the table data
        df = df.where(pd.notnull(df), None)
        
        # Remove leading and trailing spaces from column names
        df.columns = df.columns.str.strip() 
        
        # Remove redundant starting and ending quotes from the values
        def remove_quotes(value):
            if isinstance(value, str):
                value = value.strip()
                value = value.strip('"')
                return value
            return value
        df = df.map(remove_quotes)
        
        # Convert DataFrame to a dictionary for easy JSON serialization
        data = df.to_dict(orient='records')
        return JsonResponse({"data": data})
    except Exception as e:
        print('upload file error', e)
        raise HttpError(400, str(e))
    
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
        df, LLM_res = handle_data_transformation(table_data, user_query)


    updated_table_data = df.to_dict(orient='records')
    return JsonResponse({
        "user_query": user_query, 
        "LLM_res": LLM_res.to_dict(),
        "updated_table_data": updated_table_data
    })
    

    
