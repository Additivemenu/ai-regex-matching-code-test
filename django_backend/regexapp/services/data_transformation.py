
import pandas as pd
from regexapp.services.openai import query_open_ai_for_regex_replacement

def handle_data_transformation(table_data, user_query):
    # ! data transformation query
    # TODO: since 1, 2 are both for numerical values, we should try to convert nominated column as numerical values first, then check if it is numerical, then proceed
    

    # 
    print('------------ start querying OpenAI API ------------')
    LLM_res = query_open_ai_for_regex_replacement(user_query)
    print('------------ end querying OpenAI API ------------')
    
    
    print('--------start processing table data ----------')
    df = pd.DataFrame(table_data)
    
    # 1. fill missing values in the column
    df[LLM_res.column_name] = df[LLM_res.column_name].fillna(LLM_res.fill_value)
    
    
    # 2. normalize the column values
    def min_max_normalize(column):
        return (column - column.min()) / (column.max() - column.min())
    df[LLM_res.column_name] = min_max_normalize(df[LLM_res.column_name])
    
    return df, LLM_res