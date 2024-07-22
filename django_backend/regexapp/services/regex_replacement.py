import pandas as pd
from regexapp.services.openai import query_open_ai_for_regex_replacement
from http.client import HTTPException
import re
from typing import List
from ninja.errors import HttpError

def handle_regex_replacement(table_data, user_query):
    
    table_data_headers:List[str] = list(table_data[0].keys())
    
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai_for_regex_replacement(user_query, table_data_headers)
    print('------------ end querying OpenAI API ------------')

    # verify if user specified column name is really in the table data
    if LLM_res.column_name not in table_data_headers:
        raise HttpError(404, "Column name not found in table data, please check your spelling (note column name should be case sensitive) and type in a valid table header name")
    print('table data headers:', table_data_headers)


    print('--------start processing table data ----------')
    df = pd.DataFrame(table_data)

    # ! data replacement query
    df[LLM_res.column_name] = df[LLM_res.column_name].apply(lambda x: re.sub(LLM_res.regex_pattern, LLM_res.replacement, x) if pd.notnull(x) else x)  

    return df, LLM_res