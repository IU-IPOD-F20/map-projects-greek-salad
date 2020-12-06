## Install
```commandline
pip3 install -r requirements.txt 
```

## Run
```commandline
uvicorn main:app --reload
```

## Code coverage
```commandline
python -m pytest --cov=main tests/
```
```commandline
============================= test session starts ==============================
platform linux -- Python 3.8.6, pytest-6.1.2, py-1.9.0, pluggy-0.13.1
rootdir: /home/apo/work/map-projects-greek-salad/Backend
plugins: cov-2.10.1
collected 6 items

tests/test_main.py ......                                                [100%]

----------- coverage: platform linux, python 3.8.6-final-0 -----------
Name      Stmts   Miss  Cover
-----------------------------
main.py      56      8    86%


============================== 6 passed in 0.50s ===============================
```

### API Documentation
#### Swagger
http://127.0.0.1:8000/docs
#### ReDoc
http://127.0.0.1:8000/redoc