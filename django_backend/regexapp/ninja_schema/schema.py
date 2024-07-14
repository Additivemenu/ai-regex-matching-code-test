from typing import Optional
from ninja import Schema


class TableUpdateRequestBody(Schema):
    user_query: str
    table_data: list