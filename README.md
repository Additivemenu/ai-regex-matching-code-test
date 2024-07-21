

A web application that allows user to upload CSV or Excel files, display results in tabular format and interact with the table using natural language in two kinds of query:
+ Regular expression matching and replacement
+ Data transformation
  + Normalise data in a numerical column
  + Fill missing values in a numerical column

## Sample csv/excel files
see sample data file under `/samples` directory


## Back-End
tech stack:
+ django with dajngo-ninja to build RESTful API
+ integrated with OpenAI gpt4o model

To launch the back-end:

Step1: supply OpenAI api key
+ Find `django_backend/django_backend/.env.example` file, copy and paste it at the same directory level and rename it `.env` file, then fill your OpenAI api key in it

Step2: at the root directory of this repository, run below commands to start the django server running in a docker container:
```shell
cd django_backend

docker compose up --build
```

In addition to regex matching and replacement, two data transformation handler was provided: 
+ Normalise data in a numerical column
+ Fill missing values in a numerical column

Large file handling: 
when dealing with large files, there are mainly two concerns:
+ Loading a large volume of data into server memory can quickly exhaust available memory resources.
+ Processing a large volume of data at server-side could be time-consuming, potentially blocking the web application and reducing its responsiveness.

Although not currently implemented, there are two potential proposals to address the issues with large file processing
+ Streaming: When users upload large volumes of data, processing it all at once can significantly strain server memory. As an alternative, streaming allows the server to process data incrementally, chunk by chunk. Each small chunk of data is processed and immediately sent back to the client, eliminating the need to store the entire dataset in server memory. 
+ Task Queue: For handling requests involving extensive table data processing, a task queue can be utilized to process these requests asynchronously. By offloading long-running tasks to a task queue, the main web application remains responsive and avoids being blocked by heavy processing loads.


## Front-End
tech stack:
+ React + TypeScript + Tailwind CSS
+ Material UI used to build the resultant table 

To launch the Front-End:
After the back-end has been launched, run below commands to start the front-end:
```javascript
cd /react-frontend

npm install

npm start
```
