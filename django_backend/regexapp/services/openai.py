# from django.conf import settings
# openai.api_key = settings.OPENAI_API_KEY
# settings.configure()
# print(settings.OPENAI_API_KEY)
import re
from typing import TypedDict, Optional
import json
from ninja.errors import HttpError
from openai import OpenAI

from django.conf import settings


# TODO: use class instead, not dictionary
class OpenAIRegexQueryResponse:
    def __init__(self, to_regex: str, from_regex: Optional[str], replacement: Optional[str], column_name: Optional[str]):
        self.to_regex = to_regex
        self.from_regex = from_regex # if null, it means this is a replace query instead of a update query
        self.replacement = replacement # if null, it means this is a value transforming query instead of a value replacing query
        self.column_name = column_name
    
    def to_dict(self):
        return {
            'to_regex': self.to_regex,
            'from_regex': self.from_regex,
            'replacement': self.replacement,
            'column_name': self.column_name
        }

# class OpenAIRegexQueryResponseDict(TypedDict):
#     to_regex: str
#     from_regex: Optional[str]  
#     replacement: Optional[str]  
#     column_name: str


def query_open_ai(query:str) -> OpenAIRegexQueryResponse:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    # print('inside queryOpenAI: ',settings.OPENAI_API_KEY)

    try: 
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a regex assistant, skilled in converting natural language queries into regex expressions. The regex expressions will be used to manipulate data in a table. There are 2 types of query: one is to replace table value in a column with new value, one is to apply some regex transformation to the value in a column. Please provide the regex expression for the given natural language query."},
                {"role": "user", "content": f"Given the natural language query: '{query}', return in JSON format:\n field 'to_regex': the regex expression of the desired format, \n field 'from_regex': the regex expression of the original format - if you cannot find it give it a null value,  \n field 'replacement': the replacement value - if you cannot find it give it a null value,\n field 'column_name': the column name - if you cannot find it give it a null value"}
            ]
        )
        raw_result = completion.choices[0].message
        print(raw_result)

      
        '''
        Parse JSON string we get from OpenAI API to dictionary in the format of 
        {
            'to_regex': 'desired regex', 
            'from_regex': 'original regex', 
            'replacement': 'replacement value', 
            'column_name': 'column name'
        }
        '''
        # Extract the JSON content using regex to remove the surrounding backticks and "json" label (OpenAI return markdown format json) 
        json_content_str = re.search(r'```json\s*({.*})\s*```', raw_result.content, re.DOTALL).group(1) 
        parsed_dict = json.loads(json_content_str)  
        print('parsed dict in query LLM: ', parsed_dict)

        # validate the parsed dictionary following the desired format
        required_fields = ['to_regex', 'from_regex', 'replacement', 'column_name']
        missing_fields = [field for field in required_fields if field not in parsed_dict] # Check if all required fields are present
        if missing_fields:
            raise HttpError(500, f"Unexpected error: Missing fields from OpenAI API calling- {', '.join(missing_fields)}, please try again")

        # validate if user specify a column name 
        if not parsed_dict['column_name']:
            raise HttpError(400, "Bad request: Column name is not specified, please specify a column name in the query")

        return OpenAIRegexQueryResponse(parsed_dict['to_regex'], parsed_dict['from_regex'], parsed_dict['replacement'], parsed_dict['column_name'])
    except Exception as e:
        raise e

    
   