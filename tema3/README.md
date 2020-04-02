
Deploying app
```
gsutil -m rsync -r ./static gs://cc-tema-3/static
gcloud app deploy
```

Starting locally:
```
mkdir cloudsql
cloud_sql_proxy -dir=./cloudsql --instances=$CLOUD_SQL_CONNECTION_NAME --credential_file=$GOOGLE_APPLICATION_CREDENTIALS && npm start
```
