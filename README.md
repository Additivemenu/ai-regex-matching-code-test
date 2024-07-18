# ai-regex-matching-code-test

## backend
+ django with dajngo-ninja to build RESTful API

disable conda environment to avoid dependency conflicts if any
```shell
conda deactivate
```

at the root of repository, run: 
```python
# create a venv based on dependencies in requirement.txt
python3 -m venv venv  

# activate it
new_venv\Scripts\activate  # on windows or 
source new_venv/bin/activate # on Mac

# install dependencies
pip install -r requirements.txt
```

LLM choice: OpenAI gpt4o. 
+ Find `django_backend/django_backend/.env.example` file, copy and rename it `.env` file, fill your OpenAI api key


## frontend
+ React + TypeScript + Tailwind CSS
+ with minimum use of UI library

