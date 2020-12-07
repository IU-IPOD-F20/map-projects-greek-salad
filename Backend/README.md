## Install
```commandline
pip3 install -r requirements.txt 
```

## Run
```commandline
uvicorn main:app --reload
```

## Test
```commandline
python -m pytest --cov=main tests/
```

### API Documentation
#### Swagger
http://127.0.0.1:8000/docs
#### ReDoc
http://127.0.0.1:8000/redoc
