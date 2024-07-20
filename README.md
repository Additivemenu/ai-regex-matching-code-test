# ai-regex-matching-code-test


## Sample csv file
see sample csv file under `/samples` directory

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
+ Find `django_backend/django_backend/.env.example` file, copy and paste it at the same directory level and rename it `.env` file, then fill your OpenAI api key


## frontend
+ React + TypeScript + Tailwind CSS
+ Material UI used to build the table interface


```javascript
cd /react-frontend

npm install

npm start
```
