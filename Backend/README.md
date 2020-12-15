## Install
Make sure you have [Python3](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installing/) installed on your system

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

## Create coverage bage
```commandline
coverage-badge -o ../Pictures/coverage.svg
```

### API Documentation
#### Swagger
http://127.0.0.1:8000/docs
#### ReDoc
http://127.0.0.1:8000/redoc
