import re
from typing import TypedDict, Optional
import json
from ninja.errors import HttpError
from openai import OpenAI
from django.conf import settings
from enum import Enum
from typing import List

client = OpenAI(api_key=settings.OPENAI_API_KEY)
# print('inside queryOpenAI: ',settings.OPENAI_API_KEY)

# TODO: use class instead, not dictionary
class RegexReplacementOpenAIQueryResponse:
    def __init__(self, regex_pattern: str, replacement: str, column_name: str):
        self.regex_pattern = regex_pattern 
        self.replacement = replacement 
        self.column_name = column_name
    
    def to_dict(self):
        return {
            'regex_pattern': self.regex_pattern,
            'replacement': self.replacement,
            'column_name': self.column_name
        }


def query_open_ai_for_regex_replacement(query:str, table_headers: List[str]) -> RegexReplacementOpenAIQueryResponse:
    print('in open ai regex query:',table_headers)
    table_headers_str = ",".join(table_headers)
    print('table header list string:', table_headers_str)
    
    try: 
        # ! should we send table data to OpenAI API as well?
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a regex assistant, skilled in converting natural language queries into regex expressions. The regex expressions will be used to manipulate data in a table. There are 2 types of query: one is to replace table value in a column with new value, one is to apply some regex transformation to the value in a column. Please provide the regex expression for the given natural language query."},
                {"role": "user", "content": f"Given the natural language query: '{query}', return in JSON format: "+
                                                "field 'regex_pattern': the regex expression that user want to match, please don't use greedy matching like '.*' - if you cannot find it give it a null value, " + 
                                                "field 'replacement': the replacement value that user want to replace the matching regex pattern - if you cannot find it give it a null value, "+
                                               f"field 'column_name': the column name that user want to perform operation, based on '{query}', return a closest column name from column name list [{table_headers_str}], the returned value should be case-sensitive and there should be only one returned value - if you cannot find it give it a null value"},
            ]
        )
        raw_result = completion.choices[0].message
        print(raw_result)

      
        '''
        Parse JSON string we get from OpenAI API to dictionary in the format of 
        {
            'regex_pattern': 'regex', 
            'replacement': 'replacement value', 
            'column_name': 'column name'
        }
        '''
        # Extract the JSON content using regex to remove the surrounding backticks and "json" label (as OpenAI api return markdown format json) 
        json_content_str = re.search(r'```json\s*({.*})\s*```', raw_result.content, re.DOTALL).group(1) 
        parsed_dict = json.loads(json_content_str)  
        print('parsed LLM response: ', parsed_dict)

        # validate the parsed dictionary following the desired format
        required_fields = ['regex_pattern', 'replacement', 'column_name']
        missing_fields = [field for field in required_fields if field not in parsed_dict] # Check if all required fields are present
        if missing_fields:
            raise HttpError(500, f"Unexpected error: Missing fields from OpenAI API calling- {', '.join(missing_fields)}, please try again")
        if any([parsed_dict[field] is None for field in required_fields]):
            raise HttpError(500, "Unexpected error: OpenAI API response contains None value, please check if you are using the correct query type and try again")
    
    
        # validate if user specify a column name 
        if not parsed_dict['column_name']:
            raise HttpError(400, "Bad request: Column name is not specified, please specify a column name in the query")
        
        # force to use lazy matching
        if parsed_dict['regex_pattern'] == ".*":
            parsed_dict['regex_pattern'] = ".+"
        
        return RegexReplacementOpenAIQueryResponse(parsed_dict['regex_pattern'], parsed_dict['replacement'], parsed_dict['column_name'])
    except Exception as e:
        raise e

class TransformationType(str, Enum):
    NORMALIZE = "normalize"
    FILL_MISSING = "fill_missing"

class DataTransformationOpenAIQueryResponse:
    def __init__(self, transformation_type:TransformationType,  payload: Optional[float or int], column_name: str): 
        self.transformation_type = transformation_type
        self.payload = payload
        self.column_name = column_name
        
    def to_dict(self):
        return {
            'transformation_type': self.transformation_type,
            'payload': self.payload,
            'column_name': self.column_name
        }    


def query_open_ai_for_data_transformation(query:str, table_headers:List[str]) -> DataTransformationOpenAIQueryResponse:

    print('in open ai data transform query:',table_headers)
    table_headers_str = ",".join(table_headers)
    print('table header list string:', table_headers_str)
    
    try: 
        # ! should we send table data to OpenAI API as well?
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are going to extract useful information given a user query in natural language. The information will be used to transform data in a table. There are 2 types of query: one is to fill missing values in a column, one is to normalize the values in a column. Please provide the transformation type and the payload for the given natural language query."},
                {"role": "user", "content": f"Given the natural language query: '{query}', return in JSON format:"+ 
                                                "field 'transformation_type': options are 'fill_missing' or 'normalize' - if you cannot find it give it a null value,  " +
                                                "field 'payload': the missing value that user want to fill a column, this only applies to 'fill_missing' transformation type - if you cannot find it give it a null value," +
                                               f"field 'column_name': the column name that user want to perform operation, based on '{query}', return a closest column name from column name list [{table_headers_str}], the returned value should be case-sensitive and there should be only one returned value - if you cannot find it give it a null value"},
            ]
        )
        raw_result = completion.choices[0].message
        print(raw_result)

      
        '''
        Parse JSON string we get from OpenAI API to dictionary in the format of 
        {
            'transformation_type': 'fill_missing' or 'normalize', 
            'payload': 'e.g. missing value that user wants to fill', 
            'column_name': 'column name'
        }
        '''
        # Extract the JSON content using regex to remove the surrounding backticks and "json" label (as OpenAI api return markdown format json) 
        json_content_str = re.search(r'```json\s*({.*})\s*```', raw_result.content, re.DOTALL).group(1) 
        parsed_dict = json.loads(json_content_str)  
        print('parsed LLM response: ', parsed_dict)

        # validate the parsed dictionary following the desired format
        required_fields = ['transformation_type', 'payload', 'column_name']
        missing_fields = [field for field in required_fields if field not in parsed_dict] # Check if all required fields are present
        if missing_fields:
            raise HttpError(500, f"Unexpected error: Missing fields from OpenAI API calling- {', '.join(missing_fields)}, please try again")
        if any([parsed_dict[field] is None for field in ['transformation_type','column_name']]):
            raise HttpError(500, "Unexpected error: OpenAI API response contains None value, please check if you are using the correct query type and try again")
    
    
        # validate if user specify a column name 
        if not parsed_dict['column_name']:
            raise HttpError(400, "Bad request: Column name is not specified, please specify a column name in the query")
        

        return DataTransformationOpenAIQueryResponse(parsed_dict['transformation_type'], parsed_dict['payload'], parsed_dict['column_name'])
    except Exception as e:
        raise e