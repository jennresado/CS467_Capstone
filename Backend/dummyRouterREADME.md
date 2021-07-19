# API Documentation for Dummy Animals Router

| Type | Endpoint | Params | 
| ---- | -------- | ------ | 
| GET | /dummy/animals/ | none | 
| GET | /dummy/animals/animal_id/1 | animal id in url must be set to 1 | 
| GET | /dummy/animals/date/01-10-2021 | date in url must be set to 01-10-2021 | 
| GET | /dummy/animals/type/dog | type in url must be set to dog | 
| GET | /dummy/animals/breed/calico | breed in url must be set to calico | 
| GET | /dummy/animals/avail/not_available | can have the param after avail be available or pending as well | 
| GET | /dummy/animals/dispositions/animals | disposition in url must be set to animals | 
| PUT | /dummy/animals/:animal_id | animal_id in url | 
| POST | /dummy/animals/ | body of animal object | 
| DEL | /dummy/animals/:animal_id | animal_id in url | 

## This is a dummy router to give the front end data in the same format that it will come from the database so they can work on their side without having to wait for the database to be completely set up. 