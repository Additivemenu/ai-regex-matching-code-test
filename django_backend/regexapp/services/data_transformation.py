
import pandas as pd
from regexapp.services.openai import query_open_ai_for_data_transformation, TransformationType
from ninja.errors import HttpError

def handle_data_transformation(table_data, user_query):
    # ! data transformation query
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai_for_data_transformation(user_query)
    print('------------ end querying OpenAI API ------------')
    

    print('--------start processing table data ----------')
    df = pd.DataFrame(table_data)
    # TODO: since 1, 2 are both for numerical values, we should try to convert nominated column as numerical values first, then check if it is numerical, then proceed
    try:
        df[LLM_res.column_name] = pd.to_numeric(df[LLM_res.column_name])
    except ValueError as e:
        print(f"Error: {e}")
        raise HttpError(400, f"Error: The column {LLM_res.column_name} contains non-numeric values, please make sure the column contains only numerical values")
    
    # 1. fill missing values in the column
    if (LLM_res.transformation_type == TransformationType.FILL_MISSING):
        df[LLM_res.column_name] = df[LLM_res.column_name].fillna(LLM_res.payload)
    
    # 2. normalize the column values
    if (LLM_res.transformation_type == TransformationType.NORMALIZE):

        column_min = df[LLM_res.column_name].min()
        column_max = df[LLM_res.column_name].max()
        df[LLM_res.column_name] = round((df[LLM_res.column_name] - column_min) / (column_max - column_min), 4)
        
    
    return df, LLM_res