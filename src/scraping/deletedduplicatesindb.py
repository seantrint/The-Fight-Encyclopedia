# -*- coding: utf-8 -*-
"""
Created on Sun May 31 21:19:16 2020

@author: Sean
"""

import pyodbc 
conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                      'Database=testdata;'
                      'Trusted_Connection=yes;')

cursor = conn.cursor()
#select every name from db
cursor.execute(str('with cte as '
+'(select b.BoxerId, b.BoxerName, s.BoxerID as statsboxerid, r.BoxerID as reccie, i.BoxerID as imagie, ROW_NUMBER()'
+' OVER(PARTITION BY b.BoxerName ORDER BY b.BoxerName) row_num'
+' from Boxer b' 
+' inner join BoxerStats s' 
+' inner join BoxerRecord r'
+' inner join BoxerImage i'
+' on i.BoxerID = r.BoxerID'
+' on r.BoxerID = s.BoxerID'
+' on s.BoxerID = b.BoxerId)'
+' select BoxerId from cte'
+' where row_num > 1;'))
duplicateidslist =[]
for row in cursor:
    duplicateidslist.append(row[0])
for duplicateid in duplicateidslist:
    removeFromBoxerQuery = 'delete from Boxer where BoxerId = {0}'.format(duplicateid)
    removeFromBoxerStatsQuery = 'delete from BoxerStats where BoxerID = {0}'.format(duplicateid)
    removeFromBoxerRecordQuery = 'delete from BoxerRecord where BoxerId = {0}'.format(duplicateid)
    removeFromBoxerImageQuery = 'delete from BoxerImage where BoxerId = {0}'.format(duplicateid)
    
    cursor.execute(removeFromBoxerQuery)
    cursor.execute(removeFromBoxerStatsQuery)
    cursor.execute(removeFromBoxerRecordQuery)
    cursor.execute(removeFromBoxerImageQuery)
cursor.commit()  
cursor.close()
conn.close()  