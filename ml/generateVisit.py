from datetime import datetime, timedelta
from healthcare.models import Visit
from healthcare.models import Patient

from datetime import datetime, timedelta
import random

random_date = datetime.now() - timedelta(days=random.randint(0, 183))

#exec(open('/home/baa/HealthcareProject/ml/generateVisit.py').read())


import csv
bad = ('\ufeffpol', "ves", "travma", "onko", "infec", "uzi", "nasled")
data_list = list(csv.DictReader(open('X01.csv')))

tapID = 123765
patient = Patient.objects.get(pk=2)
d = data_list[0]

for key in d.keys(): 
    if key not in bad:     
        print(key, data_list[0][key])
        Visit.objects.create(
            patientID=patient,
            tapID=tapID,
            investigationName=key,
            investigationResult=d[key],
            investigationDate=random_date,
            visitResult=None  
        )