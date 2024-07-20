import pandas as pd
from regexapp.services.openai import query_open_ai_for_regex_replacement
from http.client import HTTPException
import re


def handle_regex_replacement(table_data, user_query):
    # LLM_res = queryOpenAI("find the email address column in the table and replace them with 'hello'")
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai_for_regex_replacement(user_query)
    print('------------ end querying OpenAI API ------------')

    # verify if user specified column name is really in the table data
    table_data_headers = table_data[0].keys()
    if LLM_res.column_name not in table_data_headers:
        raise HTTPException(status_code=404, detail="Column name not found in table data, please check your spelling (note column name should be case sensitive) and type in a valid table header name")
    print('table data headers:', table_data_headers)


    print('--------start processing table data ----------')
    df = pd.DataFrame(table_data)

    # ! data replacement query
    df[LLM_res.column_name] = df[LLM_res.column_name].apply(lambda x: re.sub(LLM_res.regex_pattern, LLM_res.replacement, x) if pd.notnull(x) else x)  

    return df, LLM_res