
import pandas as pd
from regexapp.services.openai import query_open_ai_for_data_transformation, TransformationType
from ninja.errors import HttpError
from typing import List
from ninja.errors import HttpError


def handle_data_transformation(table_data, user_query):
    
    table_data_headers:List[str] = list(table_data[0].keys())
    
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai_for_data_transformation(user_query, table_data_headers)
    print('------------ end querying OpenAI API ------------')
    

    print('--------start processing table data ----------')
    df = pd.DataFrame(table_data)
    
    # check if the column name is in the table data
    if LLM_res.column_name not in table_data_headers:
        raise HttpError(404, f"Column name {LLM_res.column_name} not found in table data, please check your spelling and type in a valid table header name")
    print('table data headers:', table_data_headers)
    
    
    try:
        df[LLM_res.column_name] = pd.to_numeric(df[LLM_res.column_name])
    except ValueError as e:
        print(f"Error: {e}")
        raise HttpError(400, f"Error: The column {LLM_res.column_name} contains non-numeric values, please make sure the column contains only numerical values")
    except Exception as e:  # Catch any unexpected exceptions
        print(f"Error: {e}")
        raise HttpError(500, f"Error: unexpected error occured when converting column {LLM_res.column_name} to numeric column")
    
    # 1. fill missing values in the column
    if (LLM_res.transformation_type == TransformationType.FILL_MISSING):
        try: 
            df[LLM_res.column_name] = df[LLM_res.column_name].fillna(LLM_res.payload)
        except Exception as e:
            print(f"Error: {e}")
            raise HttpError(500, f"Error: unexpected error occured when filling missing values in column {LLM_res.column_name} - {e}")
    
    # 2. normalize the column values
    if (LLM_res.transformation_type == TransformationType.NORMALIZE):
        try:
            column_min = df[LLM_res.column_name].min()
            column_max = df[LLM_res.column_name].max()
            df[LLM_res.column_name] = round((df[LLM_res.column_name] - column_min) / (column_max - column_min), 4)
        except Exception as e:
            print(f"Error: {e}")
            raise HttpError(500, f"Error: unexpected error occured when normalizing column {LLM_res.column_name} - {e}")
        
    
    return df, LLM_res