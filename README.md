# ai-regex-matching-code-test


## Sample csv/excel files
see sample data file under `/samples` directory


## backend
+ django with dajngo-ninja to build RESTful API

LLM choice: OpenAI gpt4o. 
+ Find `django_backend/django_backend/.env.example` file, copy and paste it at the same directory level and rename it `.env` file, then fill your OpenAI api key

after you have supplied OpenAI api key in `.env` file, run below commands to start the django server in docker:
```shell
cd django_backend

docker compose up --build
```

data transformation: 
+ normalise data in a numerical column
+ fill missing values in a numerical column

large file handling
+ streaming
+ task queue


## frontend
+ React + TypeScript + Tailwind CSS
+ Material UI used to build the table interface


```javascript
cd /react-frontend

npm install

npm start
```
